package com.bbb.pjtname.api.service;

import com.bbb.pjtname.db.repository.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class GameService {
    private final SessionRepository sessionRepository;
}
